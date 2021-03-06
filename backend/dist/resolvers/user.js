"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const sendEmail_1 = require("../utils/sendEmail");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const User_1 = require("../entity/User");
const UserTypes_1 = require("../types/UserTypes");
const constants_1 = require("../utils/constants");
const EmailPasswordInput_1 = require("../utils/EmailPasswordInput");
const ValidateRegister_1 = require("../utils/ValidateRegister");
const WelcomeEmail_1 = __importDefault(require("../emails/WelcomeEmail"));
let UserResolver = class UserResolver {
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = ValidateRegister_1.ValidateRegister(options);
            if (errors)
                return { errors };
            const hashpass = yield argon2_1.default.hash(options.password);
            let user;
            try {
                const res = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User_1.User)
                    .values({
                    email: options.email,
                    fullName: options.fullName,
                    password: hashpass,
                })
                    .returning("*")
                    .execute();
                user = res.raw[0];
                sendEmail_1.sendEmail(options.email, WelcomeEmail_1.default(options.fullName, options.email), "Welcome to VR Funds Platform");
            }
            catch (err) {
                if (err.code === "23505" || err.detail.includes("already exists")) {
                    return {
                        errors: [
                            {
                                field: "email",
                                message: "Email is taken.",
                            },
                        ],
                    };
                }
                console.log("message: ", err.message);
            }
            req.session.userId = user.id;
            return { user };
        });
    }
    login(email, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email: email } });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "That user doesn't exist.",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Incorrect password.",
                        },
                    ],
                };
            }
            req.session.userId = user.id;
            console.log("## LOGIN ### Cookie Set");
            return { user };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie(constants_1.COOKIE_NAME);
                if (err) {
                    console.error(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email } });
            if (!user) {
                return true;
            }
            const token = uuid_1.v4();
            yield redis.set(constants_1.FORGOT_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3);
            sendEmail_1.sendEmail(email, `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`, "Change Password Requested");
            return true;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(id);
            if (!user) {
                return {
                    errors: [
                        {
                            field: "error",
                            message: "That user doesn't exist.",
                        },
                    ],
                };
            }
            return {
                user,
            };
        });
    }
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            return User_1.User.findOne({ id: req.session.userId });
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => UserTypes_1.UserResponse),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmailPasswordInput_1.EmailPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserTypes_1.UserResponse),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserTypes_1.UserResponse),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUserById", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map