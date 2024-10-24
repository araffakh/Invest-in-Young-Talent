import Vue from "vue";
import VueRouter from "vue-router";
import LedStatusView from "@/views/SetLedsStatusView.vue";
import LedBrightView from "@/views/SetLedBrightView.vue";
import AllLedsStatusView from "@/views/AllLedsStatusView.vue";
import ServoControlView from "@/views/ServoControlView.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "LedStatusView",
        component: LedStatusView,
    },
    {
        path: "/LedBright",
        name: "LedBrightView",
        component: LedBrightView,
    },
    {
        path: "/AllLedsStatus",
        name: "AllLedsStatusView",
        component: AllLedsStatusView,
    },
    {
        path: "/ServoControl",
        name: "ServoControlView",
        component: ServoControlView,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
