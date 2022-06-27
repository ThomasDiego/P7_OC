<template>
  <div class="header">
    <div class="headerGroup headerLeft">
      <router-link class="logo" :to="{ path: '/' }"></router-link>
    </div>
    <div class="headerGroup headerz headerHide">
      <router-link class="homeIcon" :to="{ path: '/home' }"
        >Accueil</router-link
      >
      <!-- <router-link class="likeIcon" :to="{ path: '/liked' }"
        >Mes favoris</router-link
      > -->
    </div>
    <div class="headerGroup headerz headerHide headerRight">
      <div class="userIcon">{{ user.username.charAt(0) }}</div>
      <div class="userName">{{ user.username }}</div>
      <router-link class="logoutIcon" :to="{ path: '/logout' }"></router-link>
    </div>
    <div class="collapse" @click="collapse"></div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "HeaderComponent",
  methods: {
    getUserInfos: function () {
      var decoded = jwt_decode(
        localStorage.getItem("token").replaceAll('"', "")
      );
      this.user = decoded;
    },
    collapse() {
      let menu = document.querySelectorAll(".headerz");
      //for each menu item
      menu.forEach((item) => {
        //if the item is hidden
        if (item.classList.contains("headerHide")) {
          //remove the class
          item.classList.remove("headerHide");
        } else {
          //add the class
          item.classList.add("headerHide");
        }
      });
    },
  },
  beforeMount() {
    this.getUserInfos();
  },
  data() {
    return {
      user: [],
      userFirstLetter: "",
    };
  },
};
</script>

<style lang="scss" scoped>
body {
  margin: 0;
}
.headerLeft {
  justify-content: left !important;
}
.headerRight {
  justify-content: right !important;
}
.header {
  width: auto;
  height: 55px;
  background-color: #fd2d01;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 9999;

  .headerGroup {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;

    > div {
      margin-left: 5px;
      margin-right: 5px;
    }

    .logo {
      width: 30px;
      height: 30px;
      background-image: url("@/assets/logo.svg");
      background-size: contain;
      background-repeat: no-repeat;
    }
    .userIcon {
      width: 35px;
      height: 35px;
      background-color: #ffd7d7;
      border-radius: 50%;
      background-size: cover;
      font-size: 18px;
      display: flex;
      place-items: center;
      justify-content: center;
      color: #fd2d01;
      text-transform: uppercase;
    }
    .likeIcon {
      padding: 10px;
      background-size: cover;
      font-size: 18px;
      display: flex;
      place-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
    }
    .likeIcon:hover {
      background-color: #2c2e3a;
    }

    .homeIcon {
      padding: 10px;
      background-size: cover;
      font-size: 18px;
      display: flex;
      place-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
    }
    .homeIcon:hover {
      background-color: #fc674a;
      border-radius: 5px;
    }

    .logoutIcon {
      margin-left: 30px;
      width: 20px;
      height: 20px;
      background-size: cover;
      font-size: 18px;
      display: flex;
      place-items: center;
      justify-content: center;
      color: #fd2d01;
      background-image: url("@/assets/logout.svg");
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(37deg)
        brightness(104%) contrast(101%);
    }

    .userName {
      color: white;
      text-decoration: none;
    }
  }
}
@media only screen and (max-width: 660px) {
  .header {
    flex-direction: column;
    height: auto;
  }
  .headerGroup {
    padding-top: 15px;
    padding-bottom: 15px;
    justify-content: center !important;
  }
  .headerHide {
    display: none !important;
  }
  .collapse {
    position: absolute;
    width: 25px;
    height: 25px;
    background-image: url("@/assets/bars-solid.svg");
    background-size: cover;
    background-repeat: no-repeat;
    margin-top: 15px;
    right: 20px;
    display: flex;
    filter: invert(100%) sepia(0%) saturate(1%) hue-rotate(142deg)
      brightness(105%) contrast(102%);
  }
}
</style>
