import numpy as np
import pandas as pd

np.random.seed(42)  # For reproducibility
n =1000

income =np.random.normal(30000, 10000, n)
expenses =np.random(20000, 8000,n)
age = np.random.randint(20,65, n)
debt = np.random.normal(5000, 2000, n)

# Simulate payment history: 0 = missed payment (20%), 1 = on-time payment (80%)
payment_history = np.random.choice ([0,1], n, p=[0.2, 0.8])
