install.packages("rjson")
install.packages("jsonlite")
library("rjson")
library(jsonlite)

result <- fromJSON("~/pix/pix/api/tests/algo/test_recsvLz0W2ShyfD63_KOFULLOK_201908050353.json", simplifyDataFrame=true)

countEachLevel <- table(result$levelOfChallenge)
barplot(countEachLevel, main="Niveau des challenges proposés", xlab="Nombre de challenge pour chaque niveau")
result$color <- ifelse(result$responseOfUser == 1, c('blue'), c('red'))

dfbar <- barplot(result$levelOfChallenge, main="Evaluation de la compétence", axes=FALSE, xlab="Epreuve", ylab="Niveau de l'acquis", ylim=c(0, 8.5), col=result$color, names.arg=result$numberOfChallenge)
axis(2,at=seq(0,8.5,1))
axis(4,at=seq(0,8.5,1))
legend(1, 8, inset=.02, title="Epreuves", c("Réussie","Echouée"), fill=c("blue", "red"), horiz=TRUE, cex=0.8)
legend(1, 7, legend=c("Niveau estimé"), col=c("green"), lty=1:2, cex=0.8)
lines(x = dfbar, y=result$estimatedLevel, col="green")
points(x = dfbar, y=result$estimatedLevel, col="green")
