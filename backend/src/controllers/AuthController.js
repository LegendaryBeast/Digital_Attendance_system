/**
 * AuthController - Thin controller layer
 * Only handles HTTP request/response
 * Delegates business logic to AuthService
 */
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    /**
     * Register new user
     */
    async register(req, res) {
        try {
            const result = await this.authService.register(req.body);

            res.status(201).json({
                message: 'User registered successfully',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(error.message.includes('already registered') ? 400 : 500)
                .json({ error: error.message });
        }
    }

    /**
     * Login user
     */
    async login(req, res) {
        try {
            const result = await this.authService.login(req.body);

            res.json({
                message: 'Login successful',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(error.message.includes('Invalid') ? 401 : 500)
                .json({ error: error.message });
        }
    }
}

module.exports = AuthController;
