from django.db import models


class State(models.Model):
    code = models.CharField(primary_key=True, max_length=3)
    name = models.CharField(max_length=45)

    class Meta:
        db_table = "state"
        managed = False


class Postcode(models.Model):
    id = models.AutoField(primary_key=True)
    postcode = models.CharField(max_length=5)
    city = models.CharField(max_length=50)
    state = models.ForeignKey(State, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "postcode"
        managed = False

    def __str__(self):
        return "{}, {}".format(self.postcode, self.city)
