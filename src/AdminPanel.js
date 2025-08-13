import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/admin/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2em',
        color: '#2c3e50'
      }}>
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2em',
        color: '#e74c3c'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2.5em',
          margin: 0
        }}>
          👥 Admin Panel
        </h1>
        <button
          onClick={fetchUsers}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e1e8ed'
      }}>
        <h3 style={{
          color: '#2c3e50',
          marginBottom: '10px'
        }}>
          📊 Summary
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '6px',
            textAlign: 'center',
            border: '1px solid #e1e8ed'
          }}>
            <div style={{
              fontSize: '2em',
              fontWeight: 'bold',
              color: '#3498db'
            }}>
              {users.length}
            </div>
            <div style={{ color: '#7f8c8d' }}>Total Users</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '6px',
            textAlign: 'center',
            border: '1px solid #e1e8ed'
          }}>
            <div style={{
              fontSize: '2em',
              fontWeight: 'bold',
              color: '#27ae60'
            }}>
              ${users.reduce((sum, user) => sum + user.credits, 0).toFixed(2)}
            </div>
            <div style={{ color: '#7f8c8d' }}>Total Credits</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '6px',
            textAlign: 'center',
            border: '1px solid #e1e8ed'
          }}>
            <div style={{
              fontSize: '2em',
              fontWeight: 'bold',
              color: '#e67e22'
            }}>
              {users.filter(user => user.credits > 0).length}
            </div>
            <div style={{ color: '#7f8c8d' }}>Users with Credits</div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '20px',
          fontSize: '1.2em',
          fontWeight: 'bold'
        }}>
          User Management
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #e1e8ed'
              }}>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  User
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Email
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Credits
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Created
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.google_id} style={{
                  borderBottom: '1px solid #e1e8ed',
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}>
                  <td style={{
                    padding: '15px',
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}>
                    {user.name}
                  </td>
                  <td style={{
                    padding: '15px',
                    color: '#7f8c8d'
                  }}>
                    {user.email}
                  </td>
                  <td style={{
                    padding: '15px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: user.credits > 0 ? '#27ae60' : '#e74c3c'
                  }}>
                    ${user.credits.toFixed(2)}
                  </td>
                  <td style={{
                    padding: '15px',
                    textAlign: 'center',
                    color: '#7f8c8d',
                    fontSize: '0.9em'
                  }}>
                    {formatDate(user.created_at)}
                  </td>
                  <td style={{
                    padding: '15px',
                    textAlign: 'center',
                    color: '#7f8c8d',
                    fontSize: '0.9em'
                  }}>
                    {formatDate(user.last_login)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#7f8c8d',
          fontSize: '1.1em'
        }}>
          No users found
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 