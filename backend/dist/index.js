"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const developers_1 = __importDefault(require("./routes/developers"));
const skills_1 = __importDefault(require("./routes/skills"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/tasks", tasks_1.default);
app.use("/developers", developers_1.default);
app.use("/skills", skills_1.default);
app.listen(3001, () => {
    console.log("Backend running on port 3001");
});
