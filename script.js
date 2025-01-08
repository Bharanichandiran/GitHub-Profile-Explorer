async function fetchProfileData() {
    const githubLink = document.getElementById("githubLink").value;
    const errorDiv = document.getElementById("error");
    
    // Clear previous data
    document.getElementById("error").innerText = '';
    document.getElementById("profileDetails").style.display = "none";
    document.getElementById("repositories").style.display = "none";
    document.getElementById("commits").style.display = "none";
    document.getElementById("repoList").innerHTML = '';
    document.getElementById("commitList").innerHTML = '';

    if (!githubLink) {
        errorDiv.innerText = "Please enter a GitHub profile URL.";
        return;
    }

    // Extract GitHub username from URL
    const username = githubLink.split('/').pop();

    try {
        const profileResponse = await fetch(`/api/profile/${username}`);
        const data = await profileResponse.json();

        if (data.error) {
            errorDiv.innerText = data.error;
        } else {
            displayProfile(data);
            displayRepositories(data.repositories);
            displayCommits(data.commits);
        }
    } catch (error) {
        errorDiv.innerText = "An error occurred. Please try again.";
    }
}

function displayProfile(data) {
    document.getElementById("profileDetails").style.display = "block";
    document.getElementById("avatar").src = data.profile.avatar_url;
    document.getElementById("name").innerText = data.profile.name || "N/A";
    document.getElementById("bio").innerText = data.profile.bio || "N/A";
    document.getElementById("location").innerText = data.profile.location || "N/A";
    document.getElementById("followers").innerText = data.profile.followers || 0;
}

function displayRepositories(repositories) {
    const repoList = document.getElementById("repoList");
    document.getElementById("repositories").style.display = "block";

    repositories.forEach(repo => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${repo.name}</strong>: ${repo.description || 'No description available'} - Stars: ${repo.stargazers_count}`;
        repoList.appendChild(listItem);
    });
}

function displayCommits(commits) {
    const commitList = document.getElementById("commitList");
    document.getElementById("commits").style.display = "block";

    commits.forEach(commit => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>Repository:</strong> ${commit.repo} <br> <strong>Commits:</strong> ${commit.commits.length > 0 ? commit.commits.map(c => c.commit.message).join('<br>') : 'No commits found'}`;
        commitList.appendChild(listItem);
    });
}
