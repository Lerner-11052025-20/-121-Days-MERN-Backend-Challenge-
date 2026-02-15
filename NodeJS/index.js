import random from 'random'

// quick uniform shortcuts
random.float((min = 0), (max = 1)) // uniform float in [ min, max )
random.int((min = 0), (max = 1)) // uniform integer in [ min, max ]
random.boolean() // true or false

// uniform distribution
random.uniform((min = 0), (max = 1)) // () => [ min, max )
random.uniformInt((min = 0), (max = 1)) // () => [ min, max ]
random.uniformBoolean() // () => [ false, true ]

// normal distribution
random.normal((mu = 0), (sigma = 1))
random.logNormal((mu = 0), (sigma = 1))

// bernoulli distribution
random.bernoulli((p = 0.5))
random.binomial((n = 1), (p = 0.5))
random.geometric((p = 0.5))

// poisson distribution
random.poisson((lambda = 1))
random.exponential((lambda = 1))

// misc distribution
random.irwinHall(n)
random.bates(n)
random.pareto(alpha)