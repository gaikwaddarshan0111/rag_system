from src.auth.database import(
    Base,
    SessionLocal,
    engine
)

from src.auth.models import User

from src.auth.security import hash_password


# ======================================
# CREATE TABLES
# ======================================

Base.metadata.create_all(
    bind=engine
)


db = SessionLocal()

def create_user(
        username: str,
        password: str,
        role: str
):

    existing_user = (
        db.query(User)
        .filter(
            User.username == username
        )
        .first()
    )

    if existing_user:

        print(
            f"User '{username}' already exists."
        )

        return

    user = User(
        username=username,
        password_hash=hash_password(
            password
        ),
        role=role,
        is_active=True
    )

    db.add(user)

    db.commit()

    print(
        f"Created {role}: {username}"
    )


if __name__ == "__main__":

    create_user(
        "admin",
        "admin123",
        "admin"
    )

    create_user(
        "agent01",
        "agent123",
        "agent"
    )
    create_user(
        "prasad",
        "agent123",
        "agent"
    )
    create_user(
        "tanzeem",
        "agent123",
        "admin"
    )



    db.close()