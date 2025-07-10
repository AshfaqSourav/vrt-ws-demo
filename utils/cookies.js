// /utils/cookies.js
export async function acceptCookiesIfVisible(page) {
  const acceptAllButton = page.getByRole('button', { name: 'Accept All' });

  const isVisible = await acceptAllButton.isVisible().catch(() => false);

  if (isVisible) {
    await acceptAllButton.click();
  }
}
