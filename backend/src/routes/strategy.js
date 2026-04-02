const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getAllStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy,
} = require('../controllers/strategyController');

const router = Router();

router.get('/', getAllStrategies);
router.get('/:id', getStrategyById);
router.post('/', authenticate, createStrategy);
router.put('/:id', authenticate, updateStrategy);

module.exports = router;
