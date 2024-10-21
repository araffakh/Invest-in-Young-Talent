<template>
    <div class="ledBright">
        <LedBrightButton
            v-for="(state, index) in statusData"
            :key="index"
            :data="state"
            :err="error"
        />
    </div>
</template>

<script>
import LedBrightButton from "@/components/led/LedBright.vue";
import { getAllData } from "../data/getAllStatus";

export default {
    name: "LedBrightView",
    components: { LedBrightButton },
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
.ledBright {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 50px;
}
</style>
