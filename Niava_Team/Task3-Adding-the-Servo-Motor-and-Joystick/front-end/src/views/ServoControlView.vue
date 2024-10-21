<template>
    <div class="ServoControl">
        <servoDance :err="error" />
    </div>
</template>

<script>
import servoDance from "@/components/servo/servoDance.vue";
import { getAllData } from "../data/getAllStatus";

export default {
    name: "ServoControlView",
    components: { servoDance },
    methods: {
        getData: async function () {
            const data = await getAllData();
            this.error = data.err;
        },
    },
    mounted() {
        this.getData();
    },
    data: () => {
        return {
            error: false,
        };
    },
};
</script>

<style scoped>
.ServoControl {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 50px;
}
</style>
