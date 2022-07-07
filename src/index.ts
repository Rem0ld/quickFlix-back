import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {
    console.log("Inserting a new user into the database...")
    const user = new User()
    user.email = 'p.lovergne@hotmail.fr'
    user.isAdmin = true
    user.password = "1234"
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    users[0].isAdmin = false;

    const result = await AppDataSource.manager.save(users[0])
    console.log("result", result)

}).catch(error => console.log(error))
