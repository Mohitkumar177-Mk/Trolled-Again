from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import webbrowser


def main() -> None:
    root = Path(__file__).resolve().parent
    port = 8000
    url = f"http://127.0.0.1:{port}/index.html"

    print(f"Serving {root}")
    print(f"Open {url}")

    try:
        webbrowser.open(url)
    except Exception:
        pass

    server = ThreadingHTTPServer(("127.0.0.1", port), SimpleHTTPRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
