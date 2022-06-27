<template>
  <router-view />
</template>
<script>
import jwt_decode from "jwt-decode";
export default {
  name: "App",
  mounted() {
    //decode jwt
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        this.$router.push("/");
      }
    }
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

body {
  margin: 0;
  font-size: 18px;
  font-family: "Lato", sans-serif !important;
  background-color: #f3f3f3;
}
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: #fd2d01 #ffd7d7;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  background: #ffd7d7;
}

*::-webkit-scrollbar-thumb {
  background-color: #fd2d01;
  border-radius: 0px;
  border: 0px solid #ffffff;
}
.container {
  margin-top: 10px;
  width: 660px;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  font-size: 16px;
  background-color: white;
  margin-top: 55px;
}

.userIcon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffd7d7;
  color: #fd2d01;
  display: flex;
  place-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 18px;
}
.linkZ {
  text-decoration: none;
  color: inherit;
}
@media only screen and (max-width: 660px) {
  .container {
    width: 100%;
  }
}
</style>
