import { Router } from 'express';

const router = Router();

// API Documentation endpoint
router.get('/api-info', (req, res) => {
    res.json({
        name: 'SpendWise API',
        version: '1.0.0',
        description: 'AI-powered personal finance tracker API',
        baseUrl: 'http://localhost:3000/api/v1',
        endpoints: {
            users: {
                register: 'POST /users/register',
                login: 'POST /users/login',
                logout: 'POST /users/logout',
                getCurrentUser: 'GET /users/me',
                updateProfile: 'PUT /users/profile'
            },
            transactions: {
                addTransaction: 'POST /transactions/add',
                getTransactions: 'GET /transactions',
                getAnalytics: 'GET /transactions/analytics',
                updateTransaction: 'PUT /transactions/:id',
                deleteTransaction: 'DELETE /transactions/:id',
                uploadPDF: 'POST /transactions/upload-pdf',
                getBatchTransactions: 'GET /transactions/batch/:batchId'
            }
        }
    });
});

export default router;
