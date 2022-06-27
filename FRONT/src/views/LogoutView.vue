<template>
    <h1>Logout</h1>
</template>

<script>
export default {
    mounted() {
        localStorage.removeItem('token');
        this.$router.push('/?logout');
    },
}
</script>
