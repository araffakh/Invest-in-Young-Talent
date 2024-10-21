<template>
    <div class="LedStatus">
        <overlayError :err="error" />

        <LedTurnButton
            v-for="(state, index) in statusData"
            :key="index"
            :data="state"
            :err="error"
        />
    </div>
</template>

<script>
import LedTurnButton from "@/components/led/LedTurnButton.vue";
import overlayError from "@/components/overlayError.vue";
import { getAllData } from "../data/getAllStatus";

export default {
    name: "LedStatusView",
    components: {
        LedTurnButton,
        overlayError,
    },
    methods: {
        getData: async function () {
            const data = await getAllData();
            this.error = data.err;
            this.statusData = data.data;
        },
    },
    mounted() {
        this.getData();
    },
    data: () => {
        return {
            statusData: "",
            error: false,
        };
    },
};
</script>

<style scoped>
.LedStatus {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 50px;
}
</style>
