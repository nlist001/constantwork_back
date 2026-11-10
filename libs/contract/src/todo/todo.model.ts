
export enum TodoEvents {
    getTaskList = 'getTaskList',
    getTaskById = 'getTaskById',
    createTask = 'createTask',
    createSeveralTasks = 'createSeveralTasks',
    updateTask = 'updateTask',
    deleteTask = 'deleteTask',

}

export enum Priority {
    low = 'low',
    medium = 'medium',
    high = 'high',
}


export enum Status {
    pending = 'pending',    // Ожидает
    active = 'active', // В работе
    done = 'done',    // Готово
}



export interface ITask {
    id: string;
    created: Date;
    updated: Date;
    name: string;
    description: string;
    priority: Priority;
    status: Status;
    durationMinutes: number;
    parent: null | string;
}

