<template>
  <div class="comment">
    <div class="left">
      <div class="userIcon">{{ data.username.charAt(0) }}</div>
    </div>
    <div class="right">
      <div class="bubble">
        <div class="bubbleTop">
          <div class="username">{{ data.username }}</div>
          <div class="date">{{ newTime }}</div>
        </div>
        <div class="commentContent">{{ newComment }}</div>
      </div>
    </div>
  </div>
</template>
<script>
const emoji = require("to-emoji");
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
moment.locale("fr");
export default {
  name: "CommentComponent",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newTime: "",
      liked: "",
      newComment: "",
    };
  },
  methods: {},
  mounted() {
    this.newTime = moment(
      moment(this.data.date * 1000).format("YYYYMMDDkkmmss"),
      "YYYYMMDDkkmmss"
    ).fromNow();
    this.newComment = emoji.emoticonToEmoji(this.data.comment);
  },
};
</script>
<style lang="scss" scoped>
.comment {
  padding: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.right {
  padding: 15px;
  background-color: #f3f3f3;
  color: black;
  border-radius: 15px;
}
.bubbleTop {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
.bubble {
  flex-direction: column;
  display: flex;
  gap: 10px;
}
.date {
  color: #bcbcbc;
}
.commentContent {
  line-break: anywhere;
}
</style>