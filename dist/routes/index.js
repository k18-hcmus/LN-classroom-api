"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classroom_route_1 = __importDefault(require("@routes/classroom.route"));
const user_route_1 = __importDefault(require("@routes/user.route"));
const auth_route_1 = __importDefault(require("@routes/auth.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_docs_mdw_1 = __importDefault(require("@middlewares/swagger-docs.mdw"));
// Export the base-router
const router = (0, express_1.Router)();
router.use('/classrooms', classroom_route_1.default);
router.use('/users', user_route_1.default);
router.use('/auth', auth_route_1.default);
router.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_docs_mdw_1.default));
exports.default = router;
