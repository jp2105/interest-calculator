import React, { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { decryptStraing, encryptStraing } from '../Helpers';
import { useHistory } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const persistedState = localStorage.getItem('appState');
    let history = useHistory();
    const [userData, setUserData] = useState(persistedState ? JSON.parse(persistedState) : {});
    useEffect(() => {
        localStorage.setItem('appState', JSON.stringify(userData));
    }, [userData]);
    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            db.collection("users").where("username", "==", username)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        alert("user not found")
                        reject(false)
                    } else {
                        querySnapshot.forEach((doc) => {
                            if (decryptStraing(doc.data().password) === password) {
                                setUserData({ ...doc.data(), id: doc.id });
                                resolve("")
                            } else {
                                alert("incorrect password");
                                reject(false)
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                    reject(false)
                });
        })

    };

    const logout = () => {
        setUserData({});
    };

    const AddTransaction = (obj) =>{
        return new Promise((resolve, reject) => {

        const documentRef = db.collection('users').doc(userData.id);
        documentRef.get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            data.transaction.push(obj);
            setUserData({...data,id:userData.id})
            return documentRef.update({
              'transaction': data.transaction
            });
          } else {
            reject(false)
            console.log('Document not found');
          }
        })
        .then(() => {
            resolve(true)
        })
        .catch((error) => {
            reject(false)
          console.error('Error updating array:', error);
        });
    })
    }
    return (
        <AuthContext.Provider value={{ userData, login, logout, AddTransaction }}>
            {children}
        </AuthContext.Provider>
    );
};
