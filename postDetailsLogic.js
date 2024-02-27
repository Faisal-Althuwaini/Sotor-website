

        // query the url to take action on post clicked
        const urlParams = new URLSearchParams(window.location.search) 
        const postIdQuery = urlParams.get("postId")

        console.log(postIdQuery)

        getPost()

function getPost() {

// Posts Get request and fill it in the page
axios.get(`${baseUrl}/posts/${postIdQuery}`)
    .then(function (response) {
      // Define the response data
      const post = response.data.data     
      const comments = post.comments
      const author = post.author

      document.getElementById("username-span").innerHTML = author.username

       let title = ""

        if ( post.title != null) {
          title = post.title
        }

        let commentsContent = ``

        // show or hide edit button
        let user = getCurrentUser()
        let isMyPost = user != null && post.author.id == user.id
        let editButtonContent = ``

        // if it's my post show edit and delete buttons
        if (isMyPost) {
          editButtonContent = `
          <button class="btn btn-danger" style='float: right; margin-left: 5px' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> <i class="fa-regular fa-trash-can"></i> </button>
          <button class="btn btn-secondary" style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> <i class="fa-regular fa-pen-to-square"></i> </button>

          `
        }


        console.log(user)

        for (comment of comments) {
            commentsContent += `
            <!-- comment -->
                   <div class="p-3 mb-2" style="background-color: rgb(47 51 56);">
                    <!-- profile pic + username -->
                    <img src="${comment.author.profile_image}" class="rounded-circle" style="width: 40px; height: 40px;" alt="">
                    <b>${comment.author.username}</b>
                    <!-- profile pic + username -->

                    <!-- comment body -->
                    <div class="mt-2">
                        ${comment.body}
                        </div>
                    <!-- comment body -->
                </div>
                <!-- comment -->
            `
        }

        const postContent = `
            <div class="card " style = "cursor: default !important;">
                <div class="card-header">
                    <img src="${author.profile_image}" class="rounded-circle" style="width: 40px; height: 40px;" alt="">
                    <b id="username">${author.username}</b>

                  ${editButtonContent}

                </div>
                <div class="card-body" style="cursor: default;" >
                    <img src="${post.image}" alt="" class="w-100">

                    <h6 style="color: rgb(154, 153, 153);" class="mt-2">
                        ${post.created_at}
                    </h6>

                    <h3>
                        ${title}
                    </h3>

                    <p>
                    ${post.body}
                    </p>

                    <hr>

                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                          </svg>

                        <span>
                            (${post.comments_count}) Comments
                        </span>
                    </div>
                </div>
                <div id="comments" class="px-3 mb-3">
                    ${commentsContent}
                </div>


                <div class="input-group mb-3 px-3" id="add-comment-div">
                  <input id="comment-input" type="text" placeholder="add your comment here.." class="form-control">
                  <button class="btn btn-outline-primary" type="button" onclick="createCommentClicked()">Send </button>
                  </div>
              </div>
        `
            
              document.getElementById("post").innerHTML = postContent

    })
    .catch(function (error) {
      // handle error
      console.log(error);
      const message = error.response.data.message
      showAlert(message,"danger")

    })

}


// Create comment function
function createCommentClicked() {
  let commentBody = document.getElementById("comment-input").value 
  let params = {
    "body": commentBody
  }

  let token = localStorage.getItem("token")
  let url = `${baseUrl}/posts/${postIdQuery}/comments`

  axios.post(url, params, {
    headers: {
      "authorization" : `Bearer ${token}`
    }
  }).then((res) =>{

    console.log(res.data)
    showAlert("The comment has been created successfully","success")
    getPost()


  }).catch((error) => {
      // catch the error and alert the error
      console.log(error)
      const message = error.response.data.message
      showAlert(message,"danger")
  })

}


// Edit post button 
function editPostBtnClicked(postObject) {

let post = JSON.parse(decodeURIComponent(postObject))
console.log(post)

  document.getElementById("post-modal-submit-btn").innerHTML = "Update"
  document.getElementById("post-id-input").value = post.id 
  document.getElementById("post-modal-title").innerHTML = "Edit Post"
  document.getElementById("post-title-input").value = post.title
  document.getElementById("post-body-input").value = post.body

let editPostModal = new bootstrap.Modal(document.getElementById("createPostModal"), {})
editPostModal.toggle()


}


// delete post button 
function deletePostBtnClicked(postObject) {

let post = JSON.parse(decodeURIComponent(postObject))
  console.log(post)

document.getElementById("delete-post-id-input").value = post.id

let deletePostModal = new bootstrap.Modal(document.getElementById("deletePostModal"), {})
deletePostModal.toggle()


}


function confirmPostDelete() {

    const token = localStorage.getItem("token")
    let postId = document.getElementById("delete-post-id-input").value
    const url = `${baseUrl}/posts/${postId}`
    const headers = {
      "authorization" : `Bearer ${token}`
    }

    
    axios.delete(url, {
      headers: headers
    })
    .then((response) => {
      console.log(response)

      // Close Modal
      const deletePostModal = document.getElementById("deletePostModal")
      const deletePostModalInstance = bootstrap.Modal.getInstance(deletePostModal)
      deletePostModalInstance.hide()     
  
      showAlert("Post has been deleted successfully","success")

        // Wait 3 second then close the alert
    setTimeout(() => {
      window.location = `home.html`
      getPost()
    }, 3000);
      
    }).catch((error) => {
      console.log(error)
      const message = error.response.data.error_message
      showAlert(message,"danger")

    })

}
