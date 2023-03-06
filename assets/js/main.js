// Handling show/hide password readability
const pwShowHide = document.querySelectorAll(".eye-icon");

pwShowHide.forEach((eyeIcon) => {
  // When clicked on the eye icon, toggling the type of input and also changing the eye icon
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
        return;
      }
      password.type = "password";

      eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
    });
  });
});
