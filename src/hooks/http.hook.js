import {useState, useCallback} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {   // useCallback - мемоизировать, чтобы не вызывать лишний раз, т.к. функция request делает запрос и может вызываться в том числе в дочерних компонентах  
    
    
    setLoading(true);
    try {   // только запрос, без обработки then 
        const response = await fetch(url, {method, body, headers}); // запрос

        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        const data = await response.json(); // ответ

        setLoading(false);
        return data;  // не трансформированные данные, которые пришли от API
    }  catch(e) {
        setLoading(false);
        setError(e.message);  // в state идет не просто true или false, а сообщение об ошибке
        throw e;
    }

    }, []);

    const clearError = useCallback(() => setError(null), []); // стереть данные об ошибке, чтобы можно было загружать новые

    return {loading, request, error, clearError} // хук возвращает объект 
}