from fastapi.testclient import TestClient

from app.main import create_app


def test_list_games_with_filters_ordering_and_pagination(client, create_game):
    assert client.get("/games").json() == []

    a = create_game(
        result="win",
        color="white",
        time_control="rapid",
        error_tags=[],
        played_at="2026-01-01T10:00:00Z",
    )
    b = create_game(
        result="loss",
        color="black",
        time_control="blitz",
        error_tags=["time_trouble"],
        played_at="2026-03-01T10:00:00Z",
    )
    c = create_game(
        result="loss",
        color="white",
        time_control="blitz",
        error_tags=["hanging_piece"],
        played_at="2026-02-01T10:00:00Z",
    )

    def ids(**params):
        response = client.get("/games", params=params)
        assert response.status_code == 200
        return [g["id"] for g in response.json()]

    assert ids() == [b["id"], c["id"], a["id"]]
    assert ids(result="loss") == [b["id"], c["id"]]
    assert ids(color="black") == [b["id"]]
    assert ids(time_control="blitz") == [b["id"], c["id"]]
    assert ids(error_tag="hanging_piece") == [c["id"]]
    assert ids(result="loss", color="white") == [c["id"]]
    assert ids(limit=2) == [b["id"], c["id"]]
    assert ids(limit=2, offset=2) == [a["id"]]


def test_list_games_rejects_invalid_query_params(client):
    invalid = [
        {"result": "invalid"},
        {"error_tag": "nope"},
        {"limit": 0},
        {"limit": 101},
        {"offset": -1},
    ]
    for params in invalid:
        assert client.get("/games", params=params).status_code == 422


def test_stats_endpoint(client, create_game):
    empty = client.get("/games/stats")
    assert empty.status_code == 200
    assert empty.json()["total"] == 0 and empty.json()["win_rate"] is None

    create_game(result="win", error_tags=[])
    create_game(result="loss", error_tags=["time_trouble"])
    create_game(result="loss", error_tags=["time_trouble", "hanging_piece"])
    create_game(result="draw", error_tags=[])

    body = client.get("/games/stats").json()
    assert (body["total"], body["wins"], body["losses"], body["draws"]) == (4, 1, 2, 1)
    assert body["win_rate"] == 0.25
    assert list(body["error_tag_counts"].items()) == [
        ("time_trouble", 2),
        ("hanging_piece", 1),
    ]


def test_get_game_by_id(client, create_game):
    game = create_game()
    response = client.get(f"/games/{game['id']}")
    assert response.status_code == 200
    assert response.json() == game

    assert client.get("/games/0").status_code == 422
    assert client.get("/games/abc").status_code == 422


def test_create_game(client, payload):
    response = client.post("/games", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["id"] == 1 and body["played_at"]
    assert all(body[field] == value for field, value in payload.items())

    assert client.get("/games/1").json() == body
    assert client.post("/games", json=payload).json()["id"] == 2


def test_create_game_rejects_invalid_body(client, payload):
    invalid_bodies = [
        {},
        {k: v for k, v in payload.items() if k != "color"},
        {**payload, "opponent_rating": 9999},
        {**payload, "result": "won"},
        {**payload, "error_tags": ["not_a_tag"]},
    ]
    for body in invalid_bodies:
        assert client.post("/games", json=body).status_code == 422


def test_put_replaces_the_whole_game(client, create_game):
    game = create_game()
    new_body = {"color": "black", "result": "win", "time_control": "rapid"}

    response = client.put(f"/games/{game['id']}", json=new_body)
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == game["id"]
    assert (body["color"], body["result"], body["time_control"]) == (
        "black",
        "win",
        "rapid",
    )
    assert body["opening"] is None and body["error_tags"] == []
    assert body["played_at"] == game["played_at"]
    assert client.get(f"/games/{game['id']}").json() == body

    assert (
        client.put(f"/games/{game['id']}", json={"color": "white"}).status_code == 422
    )


def test_patch_changes_only_sent_fields(client, create_game):
    game = create_game()

    body = client.patch(
        f"/games/{game['id']}", json={"notes": "Faltou atenção."}
    ).json()
    assert body["notes"] == "Faltou atenção."
    assert (
        body["opening"] == game["opening"] and body["error_tags"] == game["error_tags"]
    )

    assert (
        client.patch(f"/games/{game['id']}", json={"opening": None}).json()["opening"]
        is None
    )
    assert client.patch(f"/games/{game['id']}", json={}).json()["opening"] is None
    assert client.get(f"/games/{game['id']}").json()["notes"] == "Faltou atenção."


def test_patch_rejects_invalid_values(client, create_game):
    game = create_game()
    for body in [
        {"result": None},
        {"error_tags": None},
        {"opponent_rating": 9999},
        {"result": "won"},
    ]:
        assert client.patch(f"/games/{game['id']}", json=body).status_code == 422


def test_delete_game(client, create_game):
    first, second = create_game(), create_game()

    response = client.delete(f"/games/{first['id']}")
    assert response.status_code == 204
    assert response.content == b""

    assert client.get(f"/games/{first['id']}").status_code == 404
    assert [g["id"] for g in client.get("/games").json()] == [second["id"]]


def test_unknown_game_returns_404_on_every_endpoint(client, payload):
    requests = [
        ("GET", None),
        ("PUT", payload),
        ("PATCH", {"notes": "x"}),
        ("DELETE", None),
    ]
    for method, body in requests:
        response = client.request(method, "/games/999", json=body)
        assert response.status_code == 404, method
        assert "999" in response.json()["detail"]


def test_app_starts_with_seed_data():
    real_client = TestClient(create_app())
    assert len(real_client.get("/games").json()) == 6
    assert real_client.get("/games/stats").json()["total"] == 6


def test_openapi_exposes_every_endpoint():
    paths = TestClient(create_app()).get("/openapi.json").json()["paths"]
    assert set(paths["/games"]) == {"get", "post"}
    assert set(paths["/games/stats"]) == {"get"}
    assert set(paths["/games/{game_id}"]) == {"get", "put", "patch", "delete"}
