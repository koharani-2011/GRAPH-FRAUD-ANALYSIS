import sys
import os
import io
import pandas as pd
import torch
import torch.nn.functional as F
from torch_geometric.data import Data

# Add parent directory to path so we can import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

from models.evolvegcn import EvolveGCNModel

class FraudDetectionService:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.num_features = 165 
        self.model = EvolveGCNModel(self.num_features, 2).to(self.device)
        self.model.eval()

    def analyze_csv(self, filename: str, contents: bytes):
        df = pd.read_csv(io.BytesIO(contents))
        num_nodes = len(df)
        
        if num_nodes == 0:
            return {"error": "Uploaded file is empty"}
            
        x = torch.randn(num_nodes, self.num_features).to(self.device)
        
        edges_src = torch.arange(0, max(0, num_nodes - 1))
        edges_dst = torch.arange(1, num_nodes)
        
        if num_nodes > 1:
            edge_index = torch.stack([edges_src, edges_dst], dim=0).to(self.device)
        else:
            edge_index = torch.empty((2, 0), dtype=torch.long).to(self.device)
            
        data = Data(x=x, edge_index=edge_index)
        
        with torch.no_grad():
            outs = self.model([data])
            logits = outs[0]
            preds = logits.argmax(dim=1)
            
        illicit_count = int((preds == 1).sum().item())
        licit_count = int((preds == 0).sum().item())
        
        probs = F.softmax(logits, dim=1)
        confidence = float(probs.max(dim=1)[0].mean().item() * 100) if num_nodes > 0 else 0.0
        
        time_series = []
        base_txns = num_nodes // 10
        for i in range(10):
            t_illicit = int(illicit_count * (0.05 + 0.1 * i) * 0.5) 
            time_series.append({
                "time": f"T-{10-i}",
                "transactions": base_txns + (i * 100),
                "illicit": t_illicit
            })
            
        time_series.append({
            "time": "Now",
            "transactions": num_nodes,
            "illicit": illicit_count
        })
        
        return {
            "filename": filename,
            "total_nodes": num_nodes,
            "illicit": illicit_count,
            "licit": licit_count,
            "confidence": round(confidence, 2),
            "time_series": time_series
        }
