; a map func
(def map
  ; a map func
  (fn [f coll] ; a map func
    (do
        (println "*" coll)
    (if (nil? coll)
      nil
      (cons (f (car coll)) (map f (cdr coll)))))))

(def add
  (fn [x y]
    (+ x y)))

(def fact 
  (fn [n]
    (if (= n 0)
      1
      (* n (fact (dec n))))))