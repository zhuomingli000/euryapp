import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const UserProfile = () => {
  const { user, credits, logout, addCredits } = useAuth();
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleAddCredits = async () => {
    setLoading(true);
    const result = await addCredits(creditAmount);
    setLoading(false);
    
    if (result.success) {
      alert(`Successfully added $${creditAmount} to your account!`);
      setShowAddCredits(false);
    } else {
      alert(`Failed to add credits: ${result.error}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e1e8ed',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#3498db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          marginRight: '10px'
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <div style={{
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1.1em'
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{
            color: '#7f8c8d',
            fontSize: '0.9em'
          }}>
            {user?.email}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #c3e6c3'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{
            color: '#2d5a2d',
            fontWeight: 'bold'
          }}>
            💰 Credits
          </span>
          <span style={{
            color: '#2d5a2d',
            fontSize: '1.2em',
            fontWeight: 'bold'
          }}>
            ${credits.toFixed(2)}
          </span>
        </div>
        
        <div style={{
          fontSize: '0.8em',
          color: '#2d5a2d'
        }}>
          Each training job costs $0.50
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <button
          onClick={() => setShowAddCredits(!showAddCredits)}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9em',
            fontWeight: 'bold'
          }}
        >
          Add Credits
        </button>
        <button
          onClick={logout}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9em',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>

      {showAddCredits && (
        <div style={{
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '10px'
        }}>
          <div style={{
            marginBottom: '10px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Add Credits
          </div>
          
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)}
              min="1"
              step="0.5"
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #e1e8ed',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            />
            <button
              onClick={handleAddCredits}
              disabled={loading}
              style={{
                padding: '8px 12px',
                backgroundColor: loading ? '#95a5a6' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9em',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
          
          <div style={{
            fontSize: '0.8em',
            color: '#7f8c8d'
          }}>
            Quick amounts: 
            <button
              onClick={() => setCreditAmount(5)}
              style={{
                margin: '0 5px',
                padding: '2px 6px',
                backgroundColor: '#ecf0f1',
                border: '1px solid #bdc3c7',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '0.8em'
              }}
            >
              $5
            </button>
            <button
              onClick={() => setCreditAmount(10)}
              style={{
                margin: '0 5px',
                padding: '2px 6px',
                backgroundColor: '#ecf0f1',
                border: '1px solid #bdc3c7',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '0.8em'
              }}
            >
              $10
            </button>
            <button
              onClick={() => setCreditAmount(20)}
              style={{
                margin: '0 5px',
                padding: '2px 6px',
                backgroundColor: '#ecf0f1',
                border: '1px solid #bdc3c7',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '0.8em'
              }}
            >
              $20
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 