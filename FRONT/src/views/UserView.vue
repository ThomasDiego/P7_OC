<template>
    <div>
        Params of URL: {{ id }}
    </div>
</template>
<script>
export default {
    name: "UserView",
    data: function () {
    return {
      id: this.$route.params.id
    }
  },
}
</script>