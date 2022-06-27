export default ({ next }) => {
    // Your custom if statement
    if (!localStorage.getItem('token')) {
        next("/")
        return false
    }
    next()
}