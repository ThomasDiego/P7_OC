<template>
  <div class="login">
    <div class="left">
      <div class="logo"></div>
      <div class="illustration"></div>
    </div>
    <div class="right">
      <div class="rightCenter">
        <div class="logoo"></div>
        <h2>Inscription</h2>
        <label for="username">Pseudo</label>
        <input type="text" v-model="username" placeholder="" />
        <label for="email">Adresse e-mail</label>
        <input type="text" v-model="mail" placeholder="" />
        <label for="password">Mot de passe</label>
        <input type="password" v-model="password" placeholder="" />
        <label for="repassword">Repéter mot de passe</label>
        <input type="password" v-model="repassword" placeholder="" />
        <div class="error"></div>
        <button @click="register">S'inscrire</button>
        <router-link class="question" to="/">Déjà inscrit ?</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      mail: "",
      password: "",
      repassword: "",
    };
  },
  methods: {
    register() {
      if (this.password !== this.repassword) {
        createToast("Les mots de passe ne correspondent pas", {
          timeout: 3000,
          type: "danger",
        });
        return;
      }
      axios
        .post(process.env.VUE_APP_API_URL + "/api/auth/signup", {
          username: this.username,
          mail: this.mail,
          password: this.password,
        })
        .then((response) => {
          if (response.status === 201) {
            createToast("Compte crée, tu peux te connecter !", {
              timeout: 10000,
              type: "success",
            });
            this.$router.push("/");
          }
        })
        .catch((error) => {
          createToast(error.response.data.error, {
            timeout: 2000,
            type: "danger",
          });
        });
    },
  },
  mounted() {
    document.title = "Inscription";
    if (localStorage.getItem("token")) {
      this.$router.push("/home");
    }
  },
};
</script>
<style lang="scss" scoped>
body {
  font-size: 18px;
}
.login {
  display: flex;
  flex-direction: row;
}
.left {
  width: 100%;
  height: 100vh;
  background-color: #fd2d01;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  box-sizing: border-box;
}
.right {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: white;
}
.rightCenter {
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  padding: 15px;
  input {
    width: auto;
    height: 45px;
    border-radius: 10px;
    border: none;
    padding-left: 10px;
    padding-right: 10px;
    border: 1px solid #bfbfbf;
    font-size: 18px;
  }
  input:focus {
    outline: none;
    border: 1px solid #4e4e4e;
  }
  button {
    height: 49px;
    width: auto;
    border: none;
    margin-top: 20px;
    background-color: #fd2d01;
    color: white;
    border-radius: 10px;
    font-size: 18px;
  }
  button:hover {
    // background-color: #3c3e4e;
    cursor: pointer;
  }
  label {
    margin-top: 15px;
    margin-bottom: 5px;
  }
}
h2 {
  font-weight: 100;
}
.error {
  color: red;
  margin-top: 15px;
  align-self: center;
}
.logo {
  width: 400px;
  height: 50px;
  background-image: url("@/assets/icon-left-font-monochrome-black.svg");
  background-size: contain;
  background-repeat: no-repeat;
  filter: invert(100%) sepia(100%) saturate(1%) hue-rotate(110deg)
    brightness(109%) contrast(101%);
}
.illustration {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/illu1.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: center;
  align-self: center;
}
.logoo {
  display: none;
  width: 300px;
  height: 60px;
  background: url("@/assets/icon-left-font-monochrome-black.svg");
  background-size: contain;
  background-repeat: no-repeat;
  margin-bottom: 30px;
}
.question {
  margin-top: 30px;
  text-decoration: none;
  color: black;
}
@media only screen and (max-width: 1085px) {
  .left {
    display: none;
  }
  .logoo {
    display: block;
    align-self: center;
  }
}
</style>