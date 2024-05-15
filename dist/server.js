"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// dotenv
(0, dotenv_1.config)();
// setting up server
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.get('/', (req, res, next) => {
    res.send('Server Online & Healthy 🟢');
});
const apiRouter = require('./api');
app.use('/api', apiRouter);
const { client } = require('./db/client');
const PORT = 3000 || process.env.PORT;
const handle = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log(`Server is running on http://localhost:${PORT}/ 🚀`);
    }
    catch (error) {
        console.log('Error server shutdown 😢');
        handle.close();
    }
}));
module.exports = { app };
