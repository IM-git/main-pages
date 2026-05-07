const showRepoFormBtn = document.getElementById("show-repo-form-btn");
const repoFormWrapper = document.getElementById("repo-form-wrapper");
const repoLinkInput = document.querySelector<HTMLInputElement>("#repo-link-input");
const processRepoLinkBtn = document.getElementById("process-repo-link-btn");
const repoErrorMessage = document.getElementById("repo-error-message");
const repoList = document.getElementById("repo-list");

type ParsedRepo = {
  normalizedUrl: string;
  displayName: string;
};

const normalizeGithubRepoUrl = (rawUrl: string): ParsedRepo | null => {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(withProtocol);
  } catch {
    return null;
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") return null;

  const cleanedPath = parsedUrl.pathname.replace(/\/+$/, "").replace(/\.git$/i, "");
  const parts = cleanedPath.split("/").filter(Boolean);

  if (parts.length !== 2) return null;

  const [owner, repo] = parts;
  if (!owner || !repo) return null;

  return {
    normalizedUrl: `https://github.com/${owner}/${repo}`,
    displayName: `${owner}/${repo}`
  };
};

const clearError = (): void => {
  if (repoErrorMessage) repoErrorMessage.textContent = "";
};

const showError = (message: string): void => {
  if (repoErrorMessage) repoErrorMessage.textContent = message;
};

if (
  showRepoFormBtn &&
  repoFormWrapper &&
  repoLinkInput &&
  processRepoLinkBtn &&
  repoErrorMessage &&
  repoList
) {
  showRepoFormBtn.addEventListener("click", () => {
    repoFormWrapper.hidden = false;
    repoLinkInput.focus();
  });

  processRepoLinkBtn.addEventListener("click", () => {
    clearError();

    const parsedRepo = normalizeGithubRepoUrl(repoLinkInput.value);
    if (!parsedRepo) {
      showError("Введите корректную ссылку на GitHub репозиторий.");
      return;
    }

    const item = document.createElement("p");
    const link = document.createElement("a");

    link.href = parsedRepo.normalizedUrl;
    link.textContent = parsedRepo.displayName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "repo-result-link";

    item.appendChild(link);
    repoList.appendChild(item);
    repoLinkInput.value = "";
  });
}
