class Movie:
    def __init__(self, name, release_year):
        self.name = name
        self.release_year = release_year
    def __str__(self):
        return f"Movie: name={self.name}, release_year={self.release_year}"
    def __repr__(self):
        return f'Movie(name="{self.name}",release_year={self.release_year})'
cool_movie = Movie("The Revenant", 2015)
print(cool_movie)

print(cool_movie.__repr__())