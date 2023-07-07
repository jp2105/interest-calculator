import React, { createContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { decryptStraing, encryptStraing } from '../Helpers';
import { useHistory } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const persistedState = localStorage.getItem('appState');
    const [userData, setUserData] = useState(persistedState ? JSON.parse(persistedState) : {});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        localStorage.setItem('appState', JSON.stringify(userData));
    }, [userData]);
    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            setLoading(true)
            db.collection("users").where("username", "==", username)
                .get()
                .then((querySnapshot) => {
                    setLoading(false)
                    if (querySnapshot.empty) {
                        alert("user not found")
                        reject(false)
                    } else {
                        querySnapshot.forEach((doc) => {
                            // if (decryptStraing(doc.data().password) === password) {
                            if (doc.data().password === password) {
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
                    setLoading(false)
                    console.log("Error getting documents: ", error);
                    reject(false)
                });
        })

    };

    const logout = () => {
        setUserData({});
    };

    const fetchUserData = () => {
        const documentRef = db.collection('users').doc(userData.id);
        documentRef.get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                setUserData({ ...data, id: userData.id })
            }
        })
    }
    const AddTransaction = (obj) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            const documentRef = db.collection('users').doc(userData.id);
            documentRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        if (data?.transaction?.length) {
                            data.transaction.push(obj);
                        } else {
                            data.transaction = [obj]
                        }
                        setUserData({ ...data, id: userData.id })
                        return documentRef.update({
                            'transaction': data.transaction
                        });
                    } else {
                        setLoading(false)
                        console.error('Document not found');
                        reject(false)
                    }
                })
                .then(() => {
                    setLoading(false)
                    resolve(true)
                })
                .catch((error) => {
                    setLoading(false)
                    console.error('Error updating array:', error);
                    reject(false)
                });
        })
    }
    return (
        <AuthContext.Provider value={{ userData, loading, login, logout, AddTransaction, fetchUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
