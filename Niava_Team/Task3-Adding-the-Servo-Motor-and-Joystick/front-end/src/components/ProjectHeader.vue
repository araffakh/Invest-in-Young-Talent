<template>
    <div id="header">
        <nav>
            <router-link to="/">Set Leds Status</router-link>
            <router-link to="/LedBright">Set Led Bright</router-link>
            <router-link to="/AllLedsStatus">All Leds Status</router-link>
            <router-link to="/ServoControl">Servo Control</router-link>
        </nav>
    </div>
</template>

<script>
export default {
    name: "ProjectHeader",
};
</script>

<style scoped>
#header {
    background-color: black;
    box-shadow: 0 0 10px 4px black;
}

nav {
    padding: 30px;
}

nav a {
    font-weight: bold;
    color: white;
    text-decoration: none;
    margin: 0 20px;
    letter-spacing: 1px;
    font-size: 20px;
}

nav a:hover {
    color: #0077ff;
}

nav a.router-link-exact-active {
    color: #0077ff;
}
</style>
