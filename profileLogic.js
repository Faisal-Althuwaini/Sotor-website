
setupUI()
getUser()
getPosts()

// get user information via api
function getUser() {
    let id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
    
    .then((response) => {
        console.log(response.data.data)
        const user = response.data.data
        // name - username - image
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = "@" + user.username
        document.getElementById("main-info-image").src = user.profile_image

        // name
        document.getElementById("name-posts").innerHTML = user.username

        // posts - comments count
        document.getElementById("main-info-posts").innerHTML = user.posts_count
        document.getElementById("main-info-comments").innerHTML = user.comments_count

        
    })
}

// Get posts from api functionality
function getPosts() {

    const id = getCurrentUserId()
    
    // Posts Get request and fill it in the page
    axios.get(`${baseUrl}/users/${id}/posts`)
        .then(function (response) {


         const posts = response.data.data
         document.getElementById("user-posts").innerHTML = ""




          // visit every object in posts and do this content to it:
          for(post of posts) {
    
            const author = post.author
            const image = post.image
            const date = post.created_at
            let title = ""
    
            if ( post.title != null) {
              title = post.title
            }
    
            const body = post.body
            const comments_count = post.comments_count
    
    
            let content = `
            <div class="card shadow my-3">
            <div class="card-header">
                <img src="${author.profile_image}" class="rounded-circle" style="width: 40px; height: 40px;" alt="">
                <b id="username">@${author.username}</b>
            </div>
            <div class="card-body" onclick="postClicked(${post.id})" >
                <img src="${image}" alt="" class="w-100">
    
                <h6 style="color: rgb(154, 153, 153);" class="mt-2">
                    ${date}
                </h6>
    
                <h3>
                    ${title}
                </h3>
    
                <p>
                ${body}
                </p>
    
                <hr>
    
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                      </svg>
    
                    <span>
                    ${comments_count} Comments
    
                    <span id="post-tags-${post.id}">
    
    
    
                    </span>
    
                    </span>
                </div>
            </div>
          </div>
              `
              // Add the content to the page
              document.getElementById("user-posts").innerHTML += content
              // increment the counter
              
              const currentPostTagsId = `post-tags-${post.id}`
    
              document.getElementById(currentPostTagsId).innerHTML = ""
    
              
            for (tag of post.tags) {
    
              
              let tagsContent = `
              
              <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
              ${tag.name}
              </button>
              
              `
              document.getElementById(currentPostTagsId).innerHTML += tagsContent
            }
    
          }
    
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    
    }

    function getCurrentUserId() {
                // query the url to take action on post clicked
                const urlParams = new URLSearchParams(window.location.search) 
                const id = urlParams.get("userid")
                return id
    }