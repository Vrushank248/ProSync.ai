# run_eval.py
import custom_eval  # REQUIRED: registers function
from oumi.core.configs import EvaluationConfig
from oumi.core.evaluation import Evaluator

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "eval.yaml")

config = EvaluationConfig.from_yaml(CONFIG_PATH)

results = Evaluator().evaluate(config)

for result in results:
    print(result.get_results())
