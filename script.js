// This is the main js


const baseUrl = "https://tarmeezacademy.com/api/v1"

let currentPage = 1
let lastPage = 1
// infinite scroll functionality
window.onscroll = function(ev) {
  if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight && currentPage < lastPage) {
      // you're at the bottom of the page
      // get more posts
      getPosts(false,currentPage + 1)
      currentPage++
  }
};
// infinite scroll 


// To setup ui when website launch
setupUI()

// Get posts from api functionality
function getPosts(reload = true,page = 1) {

// Posts Get request and fill it in the page
axios.get(`${baseUrl}/posts?limit=10&page=${page}`)
    .then(function (response) {

      lastPage = response.data.meta.last_page

      // Delete the static content
      if(reload) {
      document.getElementById("posts").innerHTML = ""
      }

      // Define the response data
      const posts = response.data.data

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

          <span onclick="userClicked(${author.id})" style="cursor:pointer;">
          <img src="${author.profile_image}" class="rounded-circle" style="width: 40px; height: 40px;" alt="">
          <b id="username">@${author.username}</b>
          </span>

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
          document.getElementById("posts").innerHTML += content
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

getPosts()



  // Login functionality via api
  function loginBtn() {

    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value


    const params = {
      "username": username,
      "password": password
    }

    const url = `${baseUrl}/login`

    axios.post(url, params)
    .then((response) => {
      console.log(response.data.token)
      
      

      // Add token to local storage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      const loginModal = document.getElementById("LoginModal")

      const loginModalInstance = bootstrap.Modal.getInstance(loginModal)
      loginModalInstance.hide()
      showAlert("Logged in successfully","success")

      setupUI()

    }).catch((error) => {
      const message = error.response.data.message
      showAlert(message,"danger")

    })


  }

 // Logout functionality via api

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setupUI()
    showAlert("Logged out successfully", "danger")
  }

  // alert if there's an error or logged in successfully
  function showAlert(customMessage,style) {
    const alertPlaceholder = document.getElementById('loginAlert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
     wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  alertPlaceholder.append(wrapper)
}

    appendAlert(customMessage, style)
  // Wait 3 second then close the alert
    setTimeout(() => {
      const alertToHide = bootstrap.Alert.getOrCreateInstance('#loginAlert')
      alertToHide.close()
    }, 3000);



  }

// Setup UI if the user is logged in or logged out ( login button - reg - logout )
  function setupUI() {
    // store token
    const token = localStorage.getItem("token")

    // login - logut buttons
    const loginDiv = document.getElementById("logged-in-div")
    const logoutDiv = document.getElementById("logout-div")

    // add post button 
    const addBtn = document.getElementById("add-btn")

    if (token == null) { // user is not logged in
      loginDiv.style.setProperty("display" , "flex" , "important")
      logoutDiv.style.setProperty("display" , "none" , "important")
      addBtn.style.setProperty("display" , "none" , "important")


    } else {  // user is logged in 

      let user = getCurrentUser()

      const usernameLable = document.getElementById("userProfileUsername")
      const userProfileImage = document.getElementById("userProfileImg")
      const localstore = JSON.parse(localStorage.getItem("user"))

      usernameLable.innerHTML = "@" + user.username
      userProfileImage.src = user.profile_image
      loginDiv.style.setProperty("display" , "none" , "important")
      logoutDiv.style.setProperty("display" , "flex" , "important")
      addBtn.style.setProperty("display" , "flex" , "important")

    }

  }

// Register functionality
  function registerBtn() {

    const username = document.getElementById("reg-username-input").value
    const password = document.getElementById("reg-password-input").value
    const name = document.getElementById("reg-name-input").value
    const image = document.getElementById("profile-image-input").files[0]
   
    // Form data because there's an image we want to upload - we don't use json in this case
    let formData = new FormData()

    formData.append("username", username)
    formData.append("password", password)
    formData.append("name", name)
    formData.append("image", image)


    const headers = {
      "Content-Type" : "multipart/form-data" ,
    }

    const url = `${baseUrl}/register`

    //  register request
    axios.post(url, formData, {
      headers: headers
    })
    .then((response) => {
      console.log(response.data)
      
      const userToken = response.data.token
      const user = response.data.user

      // Add token to local storage
      localStorage.setItem("token", userToken)
      localStorage.setItem("user", JSON.stringify(user))


      // Close Modal
      const registerModal = document.getElementById("RegisterModal")
      const registerModalInstance = bootstrap.Modal.getInstance(registerModal)
      registerModalInstance.hide()
      setupUI()
      showAlert("New User Registered Successfully","success")


    }).catch((error) => {
      // catch the error and alert the error
      console.log(error)
      const message = error.response.data.message
      console.log(message)
      showAlert(message,"danger")

    })
  }
  

  // Create new post
  function createNewPost() {
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""



    const token = localStorage.getItem("token")
    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0] // first file only
   
    // Form data because there's an image we want to upload - we don't use json in this case
    let formData = new FormData()

    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)

    let url = ``
    const headers = {
      "Content-Type" : "multipart/form-data" ,
      "authorization" : `Bearer ${token}`
    }

    if (isCreate) {


      url = `${baseUrl}/posts`
      axios.post(url, formData, {
        headers: headers
      })
      .then((response) => {
  
        // Close Modal
        const createPostModal = document.getElementById("createPostModal")
        const createPostModalInstance = bootstrap.Modal.getInstance(createPostModal)
        createPostModalInstance.hide()     
  
        showAlert("New Post Has Been Created","success")
        // getPosts()
        getPosts(true, 1)
      }).catch((error) => {
        const message = error.response.data.message
        showAlert(message,"danger")
        console.log(error)
      })


    } else {


      formData.append("_method", "put")
      url = `${baseUrl}/posts/${postId}`
      axios.post(url, formData, {
        headers: headers
      })
      .then((response) => {
  
        // Close Modal
        const createPostModal = document.getElementById("createPostModal")
        const createPostModalInstance = bootstrap.Modal.getInstance(createPostModal)
        createPostModalInstance.hide()     
  
        showAlert("Post has been Edited","success")
        getPosts(true, 1)
        setTimeout(function(){
          location.reload();
      }, 2000);      })
      
      .catch((error) => {
        const message = error.response.data.message
        showAlert(message,"danger")
        console.log(error)
      })


    }



    // Post


  }

// Get current user data in json
  function getCurrentUser() {
    let user = null
    const storageUser = localStorage.getItem("user")

    if (storageUser != null) {
      user = JSON.parse(storageUser)
    }

    return user
  }

  // Post clicked functionality (change the url to post url via postid)
  function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`

  }

  function userClicked(userId) {
    window.location = `profile.html?userid=${userId}`
  }

  // if profile clicked it should go to user's profile
  function profileClicked() {
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
  }
