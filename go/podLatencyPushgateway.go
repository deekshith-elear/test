type podLatencyMetrics struct {
   registry           *prometheus.Registry
   run_to_watch       *prometheus.GaugeVec
   schedule_to_watch  *prometheus.GaugeVec
   pod_startup        *prometheus.GaugeVec
   create_to_schedule *prometheus.GaugeVec
   schedule_to_run    *prometheus.GaugeVec
}

func newPodLatencyPushGateway(registry *prometheus.Registry) *podLatencyMetrics {

	labels := []string{"cluster_test_region", "cluster_test_droplet_size", "build_number"}
	run_to_watch := prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "run_to_watch",
			Help: "duration of the most recent test run",
		}, labels)
 
 
	schedule_to_watch := prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "schedule_to_watch",
			Help: "all failed tests from the most recent test run",
		}, labels)
 
 
	pod_startup := prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "pod_startup",
			Help: "all passed tests from the most recent test run",
		}, labels)
 
 
	create_to_schedule := prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "create_to_schedule",
			Help: "all tests from the most recent test run",
		}, labels)
 
	schedule_to_run := prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "create_to_schedule",
			Help: "all tests from the most recent test run",
		}, labels)
 
	registry.MustRegister(run_to_watch, schedule_to_watch, pod_startup, create_to_schedule, schedule_to_run)
 
 
	return &podLatencyMetrics{
		registry:           registry,
		run_to_watch:       run_to_watch,
		schedule_to_watch:  schedule_to_watch,
		pod_startup:        pod_startup,
		create_to_schedule: create_to_schedule,
		schedule_to_run:    schedule_to_run,
	}
}

/ SetMetrics configures the registry with the appropriate labels and values based on test type.
func (pl *podLatencyMetrics) SetMetrics(labels Labels, data string) error {
   var region string
   if _, ok := labels[Region]; !ok {
       return fmt.Errorf("region must be provided as a label")
   }
   region = labels[Region]


   var dropletSize string
   if _, ok := labels[DropletSize]; !ok {
       return fmt.Errorf("DropletSize must be provided as a label")
   }
   dropletSize = labels[DropletSize]


   var buildNo string
   if _, ok := labels[BuildNo]; !ok {
       return fmt.Errorf("buildNo must be provided as a label")
   }
   buildNo = labels[BuildNo]


   tr, err := ParseJSONReport(data)
   if err != nil {
       return fmt.Errorf("failed to parse xml report %q: %v", data, err)
   }


   pl.run_to_watch.WithLabelValues(region, dropletSize, buildNo).Set(tr.run_to_watch)
   pl.schedule_to_run.WithLabelValues(region, dropletSize, buildNo).Set(tr.schedule_to_run)
   pl.schedule_to_watch.WithLabelValues(region, dropletSize, buildNo).Set(tr.schedule_to_watch)
   pl.pod_startup.WithLabelValues(region, dropletSize, buildNo).Set(tr.pod_startup)
   pl.create_to_schedule.WithLabelValues(region, dropletSize, buildNo).Set(tr.create_to_schedule)

   return err
}