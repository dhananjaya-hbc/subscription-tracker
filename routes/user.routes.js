import { Router } from "express";

const userRouter = Router();

userRouter.get('/', (req, res) => res.send({ title: 'Get all users' }));

userRouter.get('/:id', (req, res) => res.send({ title: 'Get user details' }));

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user ' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));


export default userRouter;