document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form')
  const userList = document.getElementById('user-list')
  const repoList = document.getElementById('repos-list')
  const searchBox = document.getElementById('search')
  let searchName;

  function fetchUser(searchName){
    fetch(`https://api.github.com/search/users?q=${searchName}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    })
    .then(res => res.json())
    .then(data => displayUsers(data))
  }

  function fetchRepos(link){
    fetch(link, {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    }).then(res => res.json()).then(data => displayRepos(data))
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    searchName = searchBox.value
    if(searchName === "") return;
    fetchUser(searchName)

  })

  addEventListener('click', (event) => {
    if (event.target.className === 'repo-link'){
      event.preventDefault();
      console.log(event.target.href)
      
      fetchRepos(event.target.href)
      // https://api.github.com/users/andersoonweb/repos
    }
  })

  function displayRepos(data){
    console.log(data[0]["name"])

    userList.innerHTML = "";
    data.forEach(repo => {
      const li = document.createElement('li')
      const repoData = repoItems(repo)

      const r = document.createElement('a')
      r.href = repoData[2]
      r.innerText = repoData[0]
      li.appendChild(r)

      li.innerHTML += ` - (owner: ${repoData[1]})`

      repoList.appendChild(li)
    })
  }

  function repoItems(repoObj){
    const name = repoObj["name"]
    const repoOwner = repoObj["owner"]["login"]
    const html = repoObj["html_url"]

    return [name, repoOwner, html]
  }

  function displayUsers(data){
    repoList.innerHTML = "";
    data["items"].forEach(user => {
      const li = document.createElement('li')
      const userData = userItems(user)
      
      const image = document.createElement('img')
      image.src = userData[2]
      image.width = 20
      li.appendChild(image)
      
      li.innerHTML += ' '
  
      const u = document.createElement('a')
      u.href = userData[1]
      u.innerText = userData[0]
      li.appendChild(u)
  
      li.innerHTML += ' - '

      const repo = document.createElement('a')
      repo.href = userData[3]
      repo.innerText = "Repository"
      repo.className = "repo-link"
      li.appendChild(repo)
  
      userList.appendChild(li)
    })
  }
  
  function userItems(userObj){
    const login = userObj["login"]
    const githubLink = userObj["html_url"]
    const avatar = userObj["avatar_url"]
    const repo = userObj["repos_url"]
  
    return [login, githubLink, avatar, repo]
  }

})

