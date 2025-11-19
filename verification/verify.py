from playwright.sync_api import Page, expect, sync_playwright

def verify_setup(page: Page):
    page.goto("http://localhost:8080")
    expect(page.get_by_role("heading", name="Hello World from Eleventy!")).to_be_visible()
    expect(page.get_by_text("This page verifies that the Eleventy build process is working.")).to_be_visible()
    page.screenshot(path="verification/setup.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_setup(page)
        finally:
            browser.close()
