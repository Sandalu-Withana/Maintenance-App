import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle, Clock } from 'lucide-react';
import { useI18n } from '../../i18n';

// Mock equipment data
const mockEquipmentData = {
  'ATF-0023': {
    type: 'Pushback Tractor',
    class: 'A',
    powerType: 'Powered',
    aircraftCompatibility: 'Narrow & Wide Body (except 777)',
    distance: '85m',
    certification: {
      verified: true,
      name: 'Towbarless Tractor Certification',
    },
    fuelLevel: '80%',
    batteryLevel: 'N/A',
    lastMaintenance: '2024-03-05',
    nextMaintenance: '2024-09-05',
  },
  'ATF-0024': {
    type: 'Pushback Tractor',
    class: 'A',
    powerType: 'Powered',
    aircraftCompatibility: 'Boeing 777 Only',
    distance: '95m',
    certification: {
      verified: true,
      name: 'Towbarless Tractor Certification',
    },
    fuelLevel: '65%',
    batteryLevel: 'N/A',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-08-15',
  },
  'BTF-0012': {
    type: 'Baggage Tractor',
    class: 'B',
    powerType: 'Powered',
    aircraftCompatibility: 'All Aircraft',
    distance: '120m',
    certification: {
      verified: true,
      name: 'Baggage Tractor Certification',
    },
    fuelLevel: '45%',
    batteryLevel: 'N/A',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-07-20',
  },
};

export default function EquipmentCheckoutPage() {
  const { t } = useI18n();
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const navigate = useNavigate();

  const [checkoutMode, setCheckoutMode] = useState<'now' | 'reserve'>('now');
  const [returnTimeOption, setReturnTimeOption] = useState<
    'endOfShift' | 'specificTime' | 'duration'
  >('duration');
  const [duration, setDuration] = useState(4);
  const [specificTime, setSpecificTime] = useState('18:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get equipment data
  const equipment = equipmentId
    ? mockEquipmentData[equipmentId as keyof typeof mockEquipmentData]
    : null;

  const handleBack = () => {
    navigate('/search');
  };

  const handleCheckout = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/search');
    }, 1500);
  };

  const handleReserve = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/search');
    }, 1500);
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Get days from previous month to fill the first row
    const daysFromPrevMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const prevMonthDays = [];
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const day = new Date(year, month, 1 - i);
      prevMonthDays.push({
        date: day,
        day: day.getDate(),
        isCurrentMonth: false,
        isSelected: false,
      });
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      currentMonthDays.push({
        date: day,
        day: i,
        isCurrentMonth: true,
        isSelected: i === today.getDate(),
      });
    }

    // Next month days to fill the last row
    const totalDaysShown = 42; // 6 rows of 7 days
    const nextMonthDays = [];
    const daysNeeded =
      totalDaysShown - prevMonthDays.length - currentMonthDays.length;
    for (let i = 1; i <= daysNeeded; i++) {
      const day = new Date(year, month + 1, i);
      nextMonthDays.push({
        date: day,
        day: i,
        isCurrentMonth: false,
        isSelected: false,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const currentMonth = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  if (!equipment) {
    return (
      <div className="px-4 py-6 h-full bg-background">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Equipment Not Found</h1>
        </div>
        <div className="bg-red-900/30 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-400">
              The requested equipment could not be found. Please return to the
              search page.
            </p>
          </div>
        </div>
        <button
          onClick={handleBack}
          className="w-full mt-4 bg-[#4285f4] hover:bg-blue-700 py-2 rounded-md transition-colors"
        >
          Return to Search
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black h-full bg-background">
      <div className="px-4 pt-4 pb-6 overflow-auto h-full">
        <button onClick={handleBack} className="flex items-center mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>{t('checkout.backToSearch')}</span>
        </button>

        {/* Equipment Details Card */}
        <div className="bg-card rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-bold">{equipment.type}</h1>
            <div className="bg-input px-3 py-1 rounded-full text-sm">
              {equipmentId}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.class')}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-8 h-8 rounded-full bg-[#4285f4] text-white flex items-center justify-center font-medium">
                  {equipment.class}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.powerType')}
              </p>
              <p className="font-medium">{equipment.powerType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.aircraftCompatibility')}
              </p>
              <p className="font-medium">{equipment.aircraftCompatibility}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.distance')}
              </p>
              <p className="font-medium">{equipment.distance}</p>
            </div>
          </div>

          {/* Certification */}
          {equipment.certification.verified && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-green-700 font-medium dark:text-green-400">
                    {t('checkout.equipmentDetails.certification')}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    {equipment.certification.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-y-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.fuelLevel')}
              </p>
              <p className="font-medium">{equipment.fuelLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.batteryLevel')}
              </p>
              <p className="font-medium">{equipment.batteryLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.lastMaintenance')}
              </p>
              <p className="font-medium">{equipment.lastMaintenance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('checkout.equipmentDetails.nextMaintenance')}
              </p>
              <p className="font-medium">{equipment.nextMaintenance}</p>
            </div>
          </div>

          {/* Safety Reminder */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 dark:bg-yellow-900/20 dark:border-yellow-800">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="text-yellow-700 font-medium dark:text-yellow-500">
                  {t('checkout.safetyReminder.title')}
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-600">
                  {t('checkout.safetyReminder.message')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Options */}
        <div className="flex space-x-2 mb-4 bg-card rounded-full p-1.5">
          <button
            className={`flex-1 py-1.5 rounded-full font-semibold ${
              checkoutMode === 'now'
                ? 'bg-input'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setCheckoutMode('now')}
          >
            {t('checkout.options.checkoutNow')}
          </button>
          <button
            className={`flex-1 py-1.5 rounded-full font-semibold ${
              checkoutMode === 'reserve'
                ? 'bg-input'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setCheckoutMode('reserve')}
          >
            {t('checkout.options.reserveForLater')}
          </button>
        </div>

        {/* Checkout Form */}
        <div className="bg-card rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">
            {checkoutMode === 'now'
              ? t('checkout.checkoutForm.title')
              : t('checkout.reserveForm.title')}
          </h2>

          {checkoutMode === 'now' ? (
            <>
              <div className="mb-4">
                <p className="mb-2">{t('checkout.checkoutForm.returnTime')}</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="returnTime"
                      className="mr-2 accent-[#4285f4]"
                      checked={returnTimeOption === 'endOfShift'}
                      onChange={() => setReturnTimeOption('endOfShift')}
                    />
                    <span>{t('checkout.checkoutForm.endOfShift')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="returnTime"
                      className="mr-2 accent-[#4285f4]"
                      checked={returnTimeOption === 'specificTime'}
                      onChange={() => setReturnTimeOption('specificTime')}
                    />
                    <span>{t('checkout.checkoutForm.specificTime')}</span>
                  </label>

                  {returnTimeOption === 'specificTime' && (
                    <div className="mb-4">
                      <input
                        type="time"
                        value={specificTime}
                        onChange={(e) => setSpecificTime(e.target.value)}
                        className="px-3 bg-input border border-border rounded-md text-center"
                      />
                    </div>
                  )}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="returnTime"
                      className="mr-2 accent-[#4285f4]"
                      checked={returnTimeOption === 'duration'}
                      onChange={() => setReturnTimeOption('duration')}
                    />
                    <span>{t('checkout.checkoutForm.duration')}</span>
                  </label>

                  {returnTimeOption === 'duration' && (
                    <div className="flex items-center mb-4">
                      <Clock className="text-gray-500 dark:text-gray-400 mr-2 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={duration}
                        onChange={(e) =>
                          setDuration(Number.parseInt(e.target.value))
                        }
                        className="bg-input border border-border rounded-md text-center"
                      />
                      <span className="ml-2">
                        {t('checkout.checkoutForm.hours')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-[#4285f4] hover:bg-[#357ae8] py-2 rounded-full transition-colors text-white font-semibold"
              >
                {isSubmitting
                  ? t('checkout.processing')
                  : t('checkout.checkoutForm.scanAndCheckout')}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <p className="mb-2">
                  {t('checkout.reserveForm.reservationDate')}
                </p>
                <div className="bg-input rounded-lg p-4">
                  <p className="text-center mb-4">{currentMonth}</p>
                  <div className="grid grid-cols-7 gap-2">
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          day.isSelected
                            ? 'bg-[#4285f4] text-white'
                            : day.isCurrentMonth
                            ? 'hover:bg-[#4285f4]/20'
                            : 'text-gray-600'
                        }`}
                        disabled={!day.isCurrentMonth}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2">{t('checkout.reserveForm.pickupTime')}</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pickupTime"
                      className="mr-2 accent-[#4285f4]"
                      checked={returnTimeOption === 'endOfShift'}
                      onChange={() => setReturnTimeOption('endOfShift')}
                    />
                    <span>{t('checkout.reserveForm.endOfShift')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pickupTime"
                      className="mr-2 accent-[#4285f4]"
                      checked={returnTimeOption === 'specificTime'}
                      onChange={() => setReturnTimeOption('specificTime')}
                    />
                    <span>{t('checkout.reserveForm.specificTime')}</span>
                  </label>

                  {returnTimeOption === 'specificTime' && (
                    <div className="flex items-center mb-4">
                      <input
                        type="time"
                        value={specificTime}
                        onChange={(e) => setSpecificTime(e.target.value)}
                        className="px-3 bg-input border border-border rounded-md"
                      />
                    </div>
                  )}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pickupTime"
                      className="mr-2 accent-[#4285f4]"
                      checked={returnTimeOption === 'duration'}
                      onChange={() => setReturnTimeOption('duration')}
                    />
                    <span>{t('checkout.reserveForm.duration')}</span>
                  </label>

                  {returnTimeOption === 'duration' && (
                    <div className="flex items-center mb-4">
                      <Clock className="text-gray-500 dark:text-gray-400 mr-2 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={duration}
                        onChange={(e) =>
                          setDuration(Number.parseInt(e.target.value))
                        }
                        className="bg-input border border-border rounded-md text-center"
                      />
                      <span className="ml-2">
                        {t('checkout.reserveForm.hours')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleReserve}
                disabled={isSubmitting}
                className="w-full bg-[#4285f4] hover:bg-[#357ae8] py-2 rounded-full transition-colors text-white font-semibold"
              >
                {isSubmitting
                  ? t('checkout.processing')
                  : t('checkout.reserveForm.reserve')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
