const repoFormWrapper = document.getElementById("repo-form-wrapper");
const repoLinkInput = document.querySelector<HTMLInputElement>("#repo-link-input");
const processRepoLinkBtn = document.getElementById("process-repo-link-btn");
const repoErrorMessage = document.getElementById("repo-error-message");
const repoList = document.getElementById("repo-list");

type ParsedRepo = {
  normalizedUrl: string;
  displayName: string;
};

type GithubCommitResponse = {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
  };
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

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return (await response.json()) as T;
};

const formatCommitDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const pad = (n: number): string => String(n).padStart(2, "0");

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fetchBranchesCount = async (owner: string, repo: string): Promise<number> => {
  const branches = await fetchJson<Array<unknown>>(
    `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`
  );
  return branches.length;
};

const fetchOpenPrCount = async (owner: string, repo: string): Promise<number> => {
  const pulls = await fetchJson<Array<unknown>>(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`
  );
  return pulls.length;
};

const clearError = (): void => {
  if (repoErrorMessage) repoErrorMessage.textContent = "";
};

const showError = (message: string): void => {
  if (repoErrorMessage) repoErrorMessage.textContent = message;
};

if (
  repoFormWrapper &&
  repoLinkInput &&
  processRepoLinkBtn &&
  repoErrorMessage &&
  repoList
) {

  processRepoLinkBtn.addEventListener("click", async () => {
    clearError();

    const parsedRepo = normalizeGithubRepoUrl(repoLinkInput.value);
    if (!parsedRepo) {
      showError("Введите корректную ссылку на GitHub репозиторий.");
      return;
    }

    try {
      const [owner, repo] = parsedRepo.displayName.split("/");
    
      const commits = await fetchJson<Array<GithubCommitResponse>>(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
      );
    
      if (!commits.length) {
        showError("Не удалось получить последний коммит.");
        return;
      }
    
      const lastCommit = commits[0];
      const commitDate = formatCommitDate(lastCommit.commit.author.date);
      const shortSha = lastCommit.sha.slice(0, 6);
      const authorName = lastCommit.commit.author.name;
    
      const [branchesCount, openPrCount] = await Promise.all([
        fetchBranchesCount(owner, repo),
        fetchOpenPrCount(owner, repo)
      ]);
    
      const item = document.createElement("p");
      const link = document.createElement("a");

      link.href = parsedRepo.normalizedUrl;
      link.textContent = parsedRepo.displayName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "repo-result-link";

      const dateSpan = document.createElement("span");

      dateSpan.className = "repo-meta-date";
      dateSpan.textContent = commitDate;

      const shaSpan = document.createElement("span");

      shaSpan.className = "repo-meta-sha";
      shaSpan.textContent = `sha: ${shortSha}`;

      const authorSpan = document.createElement("span");

      authorSpan.className = "repo-meta-author";
      authorSpan.textContent = `author: ${authorName}`;

      const branchesSpan = document.createElement("span");

      branchesSpan.className = "repo-meta-branches";
      branchesSpan.textContent = `branches: ${branchesCount}`;

      const prSpan = document.createElement("span");

      prSpan.className = "repo-meta-pr";
      prSpan.textContent = `open PR: ${openPrCount}`;

      item.append(
        link,
        dateSpan,
        shaSpan,
        authorSpan,
        branchesSpan,
        prSpan
      );
    
      repoList.appendChild(item);
      repoLinkInput.value = "";
      
    } catch {
      showError("Не удалось получить данные репозитория. Проверь ссылку и попробуй еще раз.");
    }
  });
}
