import importlib

import bcrypt


def test_positive_int_parser_rejects_invalid_values(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    login = importlib.import_module("login")

    assert login.parse_positive_int(1) == 1
    assert login.parse_positive_int("2") == 2
    assert login.parse_positive_int(0) is None
    assert login.parse_positive_int(-1) is None
    assert login.parse_positive_int(True) is None
    assert login.parse_positive_int("abc") is None


def test_positive_decimal_parser_rejects_invalid_values(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    login = importlib.import_module("login")

    assert login.parse_positive_decimal("10.50") > 0
    assert login.parse_positive_decimal(0) is None
    assert login.parse_positive_decimal("-1") is None
    assert login.parse_positive_decimal(False) is None
    assert login.parse_positive_decimal("abc") is None


def test_http_url_validation(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    login = importlib.import_module("login")

    assert login.is_valid_http_url("")
    assert login.is_valid_http_url("https://example.com/image.png")
    assert login.is_valid_http_url("http://example.com/image.png")
    assert not login.is_valid_http_url("javascript:alert(1)")
    assert not login.is_valid_http_url("ftp://example.com/file")


def test_verify_password_handles_invalid_hash_values(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    login = importlib.import_module("login")
    password_hash = bcrypt.hashpw(b"Admin@123", bcrypt.gensalt()).decode("utf-8")

    assert login.verify_password("Admin@123", password_hash)
    assert login.verify_password("Admin@123", password_hash.encode("utf-8"))
    assert not login.verify_password("Admin@123", None)
    assert not login.verify_password("Admin@123", "Admin@123")


def test_profile_returns_guest_without_token(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    login = importlib.import_module("login")

    response = login.app.test_client().get("/profile")

    assert response.status_code == 200
    assert response.get_json()["authenticated"] is False
    assert response.get_json()["user"]["role"] == "guest"


def test_profile_returns_guest_for_old_server_token(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    login = importlib.import_module("login")
    token = login.create_access_token(1)
    monkeypatch.setattr(login, "TOKEN_NOT_BEFORE", login.TOKEN_NOT_BEFORE + 3600)
    client = login.app.test_client()
    client.set_cookie(login.ACCESS_TOKEN_COOKIE, token)

    response = client.get("/profile")

    assert response.status_code == 200
    assert response.get_json()["authenticated"] is False
    assert response.get_json()["user"]["name"] == "Khách"


def test_profile_returns_authenticated_user(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    login = importlib.import_module("login")
    monkeypatch.setattr(login, "get_user_by_id", lambda user_id: (user_id, "Alice", "alice@example.com", "user", 100))
    token = login.create_access_token(1)
    client = login.app.test_client()
    client.set_cookie(login.ACCESS_TOKEN_COOKIE, token)

    response = client.get("/profile")

    assert response.status_code == 200
    assert response.get_json()["authenticated"] is True
    assert response.get_json()["user"]["name"] == "Alice"
