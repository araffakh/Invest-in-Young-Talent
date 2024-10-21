<template>
    <div class="overlayError" v-show="err">
        <div class="error">
            <h1 class="title">couldn't connect to server!</h1>
            <p class="text">
                can't control the Arduino, please try restarting the website.
            </p>
            <button class="errorButton" @click="showpage()">
                press here for offline browsing
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "overlayError",
    props: ["err"],
    methods: {
        showpage: function () {
            this.err = false;
        },
    },
};
</script>

<style scoped>
.overlayError {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.753);
    z-index: 2;
}

.error,
.overlayError {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.title {
    font-size: 50px;
    color: red;
}

.text {
    font-size: 30px;
    color: white;
}

.errorButton {
}
</style>
