import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function TestSupabaseScreen() {
    const [todos, setTodos] = useState<any[]>([]);

    useEffect(() => {
        async function getTodos() {
            const { data: todos, error } = await supabase.from('todos').select();

            if (todos && todos.length > 0) {
                setTodos(todos);
            }
            if (error) {
                console.error("Error fetching todos:", error);
            }
        }

        getTodos();
    }, []);

    return (
        <div className="p-8 mt-10">
            <h2 className="text-2xl font-bold mb-4">Supabase Todos Test</h2>
            <ul className="list-disc pl-5">
                {todos.map((todo, index) => (
                    <li key={todo.id || index}>{todo.title || JSON.stringify(todo)}</li>
                ))}
            </ul>
        </div>
    );
}

export default TestSupabaseScreen;
